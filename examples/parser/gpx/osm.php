<?php

if(!$_GET["url"]){
        ?>
        <form>
        gpx url:
<!--
        <input type="text" name="url" value="http://www.openstreetmap.org/trace/653814/data" style="width:400px"/>
-->
        <input type="text" name="url" value="http://www.openstreetmap.org/trace/1066385/data" style="width:400px"/>
        <input type="submit"/>
        </form>
        <?php
        //echo "syntax: http://.....?url=http://myhost.com/file.gpx";
        die();
}

if(substr($_GET["url"],0,4)!="http"){
    echo "please insert http address only";
    die();
}

$dom=domDocument::load($_GET["url"]);
if(!$dom){
        echo "invalid gpx at <a href='{$_GET["url"]}'>{$_GET["url"]}</a>";
        die();
}

/*
$dom=domDocument::load($_GET["url"]);
if(!$dom){
    echo "invalid gpx";
    die();
}
*/

$xmlstring=makeString($dom->documentElement);

function makeString($el){
    $string="";
    $name=$el->tagName;
    if($el->nodeType==2){
        //$string.= "blabla";
    }

    if($el->nodeType==1){
        $string.= "<{$name}";
        foreach($el->attributes as $att){
            $string.= " {$att->name}='{$att->value}'";
        }
        $string.= ">";
        foreach($el->childNodes as $e){
            $string.=makeString($e);    
        }
        $string.= "</{$name}>";
    }
    return $string;
}
?>
<html>
<head>
<title>GPX Viewer</title>
<style type="text/css">
#map{
width:400px;
height:300px;
}
.gpx{
stroke:red;
stroke-width:2;
fill:none;
}
</style>
	<script type="text/javascript" src="../../../khtml_all.js"> </script>
<script type="text/javascript">


var xmlstring="<?php echo $xmlstring;?>";

var map=null;

function init(){
	map=new khtml.maplib.Map("map");  //dom element
	var center=new khtml.maplib.LatLng(48.2,15.6);  //latitude, longitude
	map.centerAndZoom(center,12); //12 = zoomlevel

        var geometry=khtml.maplib.parser.Gpx(xmlstring);  //gpx string or dom, className
        feature=map.featureCollection.appendChild(geometry);
        feature.style.stroke="red";
        feature.style.strokeWidth="3";
        feature.style.fill="none";
        var bounds=feature.bbox;
        map.bounds(bounds);

}


</script>
</head>
<body onload="init()">
<h1>GPX Example (data loaded by PHP)</h1>
<div id="map">
</div>
</body>
</html>
