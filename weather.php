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


class SpreadComputation
{
    function returnSpread($filepath, $index1, $index2)
    {
        $spread = 0;
        $row = 1;
        $atRow = 0;
        if (($handle = fopen($filepath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $num = count($data);

                $row++;

                for ($c = 0; $c < $num; $c++) {

                    if ($num > 0) {
                        $explodedArray = explode(" ", $data[$c]);
                        $newSpread = $this->computeSpread($explodedArray, $index1, $index2);

                        if ($spread < $newSpread) {
                            $spread = $newSpread;
                            $atRow = $row;
                        }
                    }
                }
            }
            fclose($handle);
        }

        echo $atRow . " " . $spread;
    }


    function computeSpread($rowArray, $index1, $index2)
    {

        if (isset($rowArray[$index1]) && isset($rowArray[$index2])) {
            if (is_numeric($rowArray[$index1]) && is_numeric($rowArray[$index2])) {
                return $rowArray[$index1] - $rowArray[$index2];
            }
        }

        return 0;
    }
}

/***
 *pass the file pass and the column index of the columns you want to compare the
 **/

$computeSpread = new SpreadComputation();

$computeSpread->returnSpread("weather.dat.txt", 1, 2);

