var myMap; // экземпляр карты
var myPlacemark; // метка (экземпляр класса Placemark)
var myCircle; var route;
let massivRoute = new Array();
massivRoute[0] = ["Маршрут", "Растояние"]; 
let i = 1;


ymaps.ready(init); // Дождёмся загрузки API и готовности DOM.

function init() 
{

// Созданем экземпляр карты и и привязываем его  к контейнеру с  заданным id ("map").
myMap = new ymaps.Map('map', {

// При инициализации карты обязательно нужно указать  её центр и коэффициент масштабирования.
center: [48.002158, 37.805078], // Донецк
zoom: 17 // изменяет масштаб контента
});

// создаем экземпляр класса метки
myPlacemark = new ymaps.Placemark([48.002158, 37.805078], { content: 'Площадь Ленина' }); 
myMap.geoObjects.add(myPlacemark);// добавляем метку на карту 

// к объекту добавим круг
myCircle = new ymaps.GeoObject({ geometry: {  type: "Circle", coordinates: [48.002158, 37.805078], 
radius: 100 } });
myMap.geoObjects.add(myCircle);


// при отправке формы срабатывает событие submit.
// Оно обычно используется для проверки формы перед ее отправкой
// на сервер или обработки ее на js
 $('#search_route').submit(function () 
 { 
    // запоминаем введенные данные из полей в переменные, которые означают начало и конец маршрута
    var start = $("#start").val(); 
    var end = $("#end").val();
    
    if (( start == "" || end=="") || ( start == null || end==null))
     alert("Выполните корректный ввод данных.");

    else
    {
    // Список точек, которые необходимо посетить
    ymaps.route([start, end],  {
   //позволяющий автоматически установить центр и коэффициент масштабирования карты так, 
   // чтобы построенный маршрут был виден целиком
    mapStateAutoApply: true,
    
    }).then(function (router) 
    {
  
        route && myMap.geoObjects.remove(route);
        $("#resmarshrut").html("");
      
        route = router;
        myMap.geoObjects.add(route);
        
        $("#resmarshrut").append('Общая длина маршрута: '+route.getHumanLength());
        $("#resmarshrut").append('<br /> Время в пути: '+route.getHumanTime());

        // записываем в массив маршрутов новый построенный маршрут
        massivRoute[i] = [`${$("#start").val()} - ${$("#end").val()}`, 
        Number.parseFloat(route.getHumanLength())];
        i++;

        activePoints = new Array();
        activePoints.push(
            new ymaps.Placemark([47.989903, 37.790746],
            {iconContent: 'Цирк Космос' }, 
            {preset:'twirl#greenStretchyIcon'}),
            
            new ymaps.Placemark([47.999417, 37.797638],
            {iconContent: 'Храм Козельщанской иконы Божьей Матери"'}, 
            {preset:'twirl#greenStretchyIcon'}),
            
            new ymaps.Placemark([ 48.01063038, 37.80535966],
            {iconContent: 'Преображенский собор'}, 
            {preset:'twirl#greenStretchyIcon'}),
            
            new ymaps.Placemark([48.005324, 37.798503],
            {iconContent: 'ДонНУ'},
            {preset:'twirl#greenStretchyIcon'}),
        );
            
        activePoints.forEach(function (point){ myMap.geoObjects.add(point);});   
    }, function (error) {
    alert("Возникла ошибка ");
    });
    return false;
}
    });

   
    $("#diagrama").click(function ()
    {
 // Установка функции обратного вызова для запуска отрисовки,
 // по окончанию загрузки API визуализации.
 google.load("visualization", "1", {packages:["corechart"]});
 google.setOnLoadCallback(drawChart);
    function drawChart()
    {
        // создание таблицы данных
        let data = google.visualization.arrayToDataTable(massivRoute);
        var options = {
            title: 'Сравнение маршрутов по их протяженности',
            heigth: '100%',
            width: '100%'
            };

        var chart = new google.visualization.PieChart(document.getElementById('chart'));
        chart.draw(data, options);
    }});

    $("#delete").click(function(e)
    {
        $("#start").val('');  $("#end").val('');
        if (route!=null)
        {
            route && myMap.geoObjects.remove(route);
        }
        $("#resmarshrut").html("");
    });
    }






    
