<?php
/**
 * Created by PhpStorm.
 * User: Osoro
 * Date: 12/9/2019
 * Time: 12:13
 */


date_default_timezone_set('Africa/Nairobi');

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: *");

class Reports extends CI_Controller
{


    public function getAllTransactions($page = 0, $type)
    {
        $search = $this->input->get('search');


        $whr['status'] = 1;

        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, $page, $search);

        if (count($Transactions) > 0) {


            $count = $this->Transactionsmodel->getTotalTransactions($whr, $search);
            $this->utility->echoJsonArray(1, $Transactions, 'No Transaction available', array('totalPages' => ceil($count / PAGE_NUMBER_ITEMS), 'totalItems' => $count));
        } else {

            $this->utility->echoJsonArray(0, NULL, 'No Transaction available');
        }


    }

    public function downloadExcel($type = null)
    {
        $objPHPExcel = $this->excel;

        $search = $this->input->get('search');


        $whr['status'] = 1;

        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, -1, $search);

        $objPHPExcel->setActiveSheetIndex(0);

        $objPHPExcel->getActiveSheet()->SetCellValue('A1', 'Country Code');
        $objPHPExcel->getActiveSheet()->SetCellValue('B1', 'Country Name');
        $objPHPExcel->getActiveSheet()->SetCellValue('C1', 'Capital');

        $objPHPExcel->getActiveSheet()->getStyle("A1:C1")->getFont()->setBold(true);

        $rowCount = 2;
        foreach ($Transactions as $key => $value) {
            $objPHPExcel->getActiveSheet()->SetCellValue('A' . $rowCount, mb_strtoupper($value['code'], 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('B' . $rowCount, mb_strtoupper($value['amount'], 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('C' . $rowCount, mb_strtoupper($value['type'], 'UTF-8'));
            $rowCount++;
        }


        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        ob_end_clean();
        header('Content-type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="Transactions File.xlsx"');
        $objWriter->save('php://output');


    }

    public function downloadPdf($type = null)
    {
        $objPHPExcel = $this->excel;

        $search = $this->input->get('search');


        $whr['status'] = 1;

        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, -1, $search);


    }


}