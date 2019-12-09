<?php
/**
 * Created by PhpStorm.
 * User: Osoro
 * Date: 12/9/2019
 * Time: 22:39
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//$file = file_get_contents("weather.dat.txt", "r");
$row = 1;
if (($handle = fopen("weather.dat.txt", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        echo "<p> $num fields in line $row: <br /></p>\n";
        $row++;
        for ($c=0; $c < $num; $c++) {
            echo $data[$c] . "<br />\n";
        }
    }
    fclose($handle);
}

?>