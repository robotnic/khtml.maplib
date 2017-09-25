<?php
$url="http://keepright.ipax.at/points.php?".$_SERVER['QUERY_STRING'];
readfile($url);
?>
