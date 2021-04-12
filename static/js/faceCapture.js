

document.getElementById('results').style.display = "None"
Webcam.set({
    width:500,
    height:500,
    image_format: 'jpg'
})

Webcam.attach("#results")


function takePicture()
{
    Webcam.snap(function (data_uri){
       document.write("<img src='"+data_uri+"' alt='from canvas'/>")
    })
}


