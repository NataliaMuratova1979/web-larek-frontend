events.on('order:send', () => {
    console.log('пора отправлять заказ');  
    
    const orderToSend = orderData.getOrder();
    console.log('сейчас будем отправлять заказ', orderToSend);
    console.log('это наш объект заказа', orderToSend); 
    console.log(orderToSend.total);
  
    api.postOrder(orderToSend)
      .then((result) => { 
        console.log('что происходит пocле then');
        
        // Создаем экземпляр класса Success
        const success = new Success(cloneTemplate(successTemplate), {
          onClick: () => {
            console.log('что происходит в onClick ');
            modal.close();
          }
        });
  
        // Рендерим модальное окно
        modal.render({
          content: success.render({
            total: orderToSend.total
          })
        });
  
        // Выполняем дополнительные действия после создания экземпляра
        Promise.all([
          new Promise((resolve) => {
            orderData.clearOrder();
            resolve();
          }),
          new Promise((resolve) => {
            basketCounter.counter = 0;
            resolve();
          }),
          new Promise((resolve) => {
            events.emit('order:sent');
            resolve();
          })
        ]).then(() => {
          console.log('Все дополнительные действия выполнены');
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
  