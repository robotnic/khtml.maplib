<html>
<head>
<style type="text/css">
body{
font-family:Arial,Verdana;
font-size:12px;
}
iframe{
width:400px;
height:250px;
border:0px solid #efefef;
border:1px solid #efefef;
width:400px;
height:250px;
box-shadow: 1px 1px 20px #e0e0e0;
border-radius:5px;
padding:10px ;
margin:10px;
}

</style>
</head>
<body>
<?php
$dirname="smallexamples/";
$dir=new directoryIterator($dirname);
foreach($dir as $file){
if($file->isDot())continue;
echo "<iframe src='";
echo $dirname;
echo $file;
echo "'> </iframe>\n";

}
?>
</body>
