callApi("companies"); // gets names of all companies in DB

var model = [];

function addToModel(companyName){
  var add = true;
  model.forEach(function(company) {
      if(companyName === company) add = false;
  });
  if (add) {
    model.push(companyName)
    $('.companyList').append("<li >" + companyName + "</li>");
    addClickEvent();
  };


};

$('#button').click(function(){
  var companyName = $('.input-field').val();
  callApi("companies?name=" + companyName);
});


function callApi(param) {
  //make ajax request

  $.getJSON( "http://localhost:3001/" + param, function( data ) {
    if(param === "companies") {
            data.forEach(function(company) {
            addToModel(company.name);
      });
      addClickEvent();
    }
    else if(param === "companies/details") {
        // list all data to all companies
    } else {
      console.log(data);
      if(data.error) {
        $('#output').text(data.error);
        return;
      };
      var text = "";
      data.data.forEach(function(element) {
        //  $('#numbers').append("<li>Jahr: " + element.year + "  Gewinn: " + element.gewinn + "  Bilanzsumme: " + element.bilanzsumme +"</li>");
        var bilanzsumme = element.bilanzsumme || "nicht veröffentlicht";
        text += "Jahr: " + element.year + "  Gewinn: " + element.gewinn + "  Bilanzsumme: " + bilanzsumme + "\n";
      });
      $('#output').text(text);
       // add click event to <li> item
      addToModel(data.name);
    };

  });
};

function addClickEvent(){
  $('li').click(function(e)
      {
        var companyName = $(this).text();
        callApi("companies?name=" + companyName);
      });
};
