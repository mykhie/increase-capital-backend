<?php
/**
 * Created by PhpStorm.
 * User: Osoro
 * Date: 12/9/2019
 * Time: 09:43
 */


class utility
{

    public $maximumIncCodelen = 8;

    public function echoJsonArray($status, $data, $message = null, $totalRecords = 0)
    {
        echo $this->returnJsonArray(array('status' => $status, 'message' => $message, 'data' => $data, 'totalRecord' => $totalRecords));
        exit;
    }


    public function returnJsonArray($dataArray)
    {
        if (sizeof($dataArray) > 0) {
            return json_encode($dataArray);
        }

        return (json_encode(array('status' => 0)));

    }

    public function returnIncrementalCode($id)
    {

        if (is_numeric($id)) {
            $code = '';
            if (($this->maximumIncCodelen - strlen($id)) > 0) {
                for ($i = 1; $i <= ($this->maximumIncCodelen - strlen($id)); $i++) {
                    $code .= '0';
                }
            }
            $code .= $id;
            return $code;
        }
        return strtoupper($this->generateRandomString(8));


    }

    public function generateRandomString($len = 10)
    {

        $min_lenght = 0;
        $max_lenght = 300;
        $bigL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $smallL = "abcdefghijklmnopqrstuvwxyz0123456789_";
        $number = "0123456789_";

        $bigB = str_shuffle($bigL);
        $smallS = str_shuffle($smallL);
        $numberS = str_shuffle($number);

        $subA = substr($bigB, 0, 8);
        $subB = substr($bigB, 8, 8);
        $subC = substr($bigB, 16, 10);

        $subD = substr($smallS, 0, 10);
        $subE = substr($smallS, 10, 10);
        $subF = substr($smallS, 20, 20);
        $subG = substr($numberS, 0, 5);
        $subH = substr($numberS, 6, 5);
        $subI = substr($numberS, 10, 5);
        $RandCode1 = str_shuffle($subA . $subD . $subB . $subF . $subC . $subE . $subG . $subH . $subI);
        $RandCode1 .= str_shuffle($subA . $subD . $subB . $subF . $subC . $subE . $subG . $subH . $subI);
        $RandCode2 = str_shuffle($RandCode1);

        $RandCode = $RandCode1 . $RandCode2;
        if ($len > $min_lenght && $len < $max_lenght) {
            return $CodeEX = substr($RandCode, 0, $len);
        }
        return $RandCode;

    }

    public function returnArrayFromInput()
    {
        $decodeJson = file_get_contents("php://input");
        $request = json_decode($decodeJson);
        return (array)$request;
    }

    public function formatDate($date, $dateformat = null)
    {
        $createdDate = date_create($date);

        if (isset($dateformat)) {
            return date_format($createdDate, $dateformat);
        }

        else  {
            return date_format($createdDate, "d M Y H:i ");
        }

        $format = "d M 'y ";
        return date_format($createdDate, $format);


    }


}