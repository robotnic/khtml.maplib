<?php
ini_set('user_agent', 'AJAX Proxy no cache for http://www.khtml.org/  OSM user robotnic');

$url="http://www.openstreetmap.org".$_GET["url"];
header("Content-type:text/xml");
$content=file_get_contents($url);
echo $content;
?>
