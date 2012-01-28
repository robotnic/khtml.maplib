<?php

$url="http://wheelmap.org/nodes.geojson?".$_SERVER['QUERY_STRING'];
readfile($url);
?>
