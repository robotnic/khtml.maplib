<?php
ini_set('user_agent', 'AJAX Proxy no cache for http://www.khtml.org/  OSM user robotnic');

$url="http://www.overpass-api.de/api/xapi?".$_GET["url"];
//$url="http://api06.dev.openstreetmap.org/".$_GET["url"];
//echo $url;
//die();
header("Content-type:text/xml");
$content=file_get_contents($url);
echo $content;
?>

