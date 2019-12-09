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


        $whr['transactions.status'] = 1;
        $postedData = $this->utility->returnArrayFromInput();
        $postedData = (array)$postedData['saveData'];

        if (isset($postedData['dateFrom'])) {
            $whr['transactions.dateCreated >= '] = date('Y-m-d', strtotime($postedData['dateFrom']));
        }
        if (isset($postedData['dateTo'])) {
            $whr['transactions.dateCreated <= '] = date('Y-m-d', strtotime($postedData['dateTo']));
        }

        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, $page, $search);

        if (count($Transactions) > 0) {


            $count = $this->Transactionsmodel->getTotalTransactions($whr, $search);
            $this->utility->echoJsonArray(1, $Transactions, ' Transaction available', array('totalPages' => ceil($count / PAGE_NUMBER_ITEMS), 'totalItems' => $count));
        } else {

            $this->utility->echoJsonArray(0, NULL, 'No Transaction available');
        }


    }

    public function downloadExcel($type = null)
    {
        $objPHPExcel = $this->excel;

        $search = $this->input->get('search');


        $whr['transactions.status'] = 1;
        $postedData = $this->utility->returnArrayFromInput();
        $postedData = (array)$postedData['saveData'];

        if (isset($postedData['dateFrom'])) {
            $whr['transactions.dateCreated >= '] = date('Y-m-d', strtotime($postedData['dateFrom']));
        }
        if (isset($postedData['dateTo'])) {
            $whr['transactions.dateCreated <= '] = date('Y-m-d', strtotime($postedData['dateTo']));
        }


        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, -1, $search);

        $objPHPExcel->setActiveSheetIndex(0);

        $objPHPExcel->getActiveSheet()->SetCellValue('A1', 'Customer Name');
        $objPHPExcel->getActiveSheet()->SetCellValue('B1', 'Transaction Date');
        $objPHPExcel->getActiveSheet()->SetCellValue('C1', 'Loan Code');
        $objPHPExcel->getActiveSheet()->SetCellValue('D1', 'Txn Number');
        $objPHPExcel->getActiveSheet()->SetCellValue('E1', 'Amount');

        $objPHPExcel->getActiveSheet()->getStyle("A1:C1")->getFont()->setBold(true);

        $rowCount = 2;
        foreach ($Transactions as $key => $value) {
            $objPHPExcel->getActiveSheet()->SetCellValue('A' . $rowCount, mb_strtoupper($value['firstName'] . " " . $value['lastName'], 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('B' . $rowCount, mb_strtoupper($this->utility->formatDate($value['dateCreated']), 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('C' . $rowCount, mb_strtoupper($value['code'], 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('D' . $rowCount, mb_strtoupper($value['transactionNo'], 'UTF-8'));
            $objPHPExcel->getActiveSheet()->SetCellValue('E' . $rowCount, mb_strtoupper(number_format($value['amount'], 2), 'UTF-8'));
            $rowCount++;
        }


        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        ob_end_clean();
        header('Content-type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="Transactions File.xlsx"');


        $filename = 'files/' . $this->utility->generateRandomString() . '.xlsx';
        $path = FCPATH . $filename;

        $objWriter->save($path);

        if ($filename)
            $this->utility->echoJsonArray(1, $filename, ' file available');

        $this->utility->echoJsonArray(0, "", ' file could not be downloaded');

    }

    public function downloadPdf($type = null)
    {
        $search = $this->input->get('search');


        $whr['transactions.status'] = 1;

        $postedData = $this->utility->returnArrayFromInput();
        $postedData = (array)$postedData['saveData'];

        if (isset($postedData['dateFrom'])) {
            $whr['transactions.dateCreated >= '] = date('Y-m-d', strtotime($postedData['dateFrom']));
        }
        if (isset($postedData['dateTo'])) {
            $whr['transactions.dateCreated <= '] = date('Y-m-d', strtotime($postedData['dateTo']));
        }


        if (is_numeric($type) && $type != 0) {
            $whr['transactionType'] = $type;
        }
        $Transactions = $this->Transactionsmodel->getAllTransactions($whr, -1, $search);
        $table = "<h3>Transactions Report</h3>";

        if ($type == 0) {
            $table .= "<h5>Transactions Report</h5>";
        }
        if ($type == 1) {
            $table .= "<h5>Disbursed Loans Report</h5>";
        }
        if ($type == 2) {
            $table .= "<h5>Loan Repayments Report</h5>";
        }


        $table .= '<table  cellspacing="0" cellpadding="1" border="1">';
        $table .= "<tr>";

        $table .= "<th> Customer Name</th>";
        $table .= "<th> Transaction Date</th>";
        $table .= "<th> Loan Code</th>";
        $table .= "<th> Txn Number</th>";
        $table .= "<th> Amount</th>";

        $table .= "</tr>";
        foreach ($Transactions as $key => $value) {
            $table .= "<tr>";
            $table .= "<td> " . $value['firstName'] . " " . $value['lastName'] . "</td>";
            $table .= "<td> " . $this->utility->formatDate($value['dateCreated']) . "</td>";
            $table .= "<td> " . $value['code'] . "</td>";
            $table .= "<td> " . $value['transactionNo'] . "</td>";
            $table .= "<td> " . number_format($value['amount'], 2) . "</td>";


            $table .= "</tr>";
        }


        $table .= "</table>";

        $file = $this->generatePdf($table);
        if ($file)
            $this->utility->echoJsonArray(1, $file, ' file available');

        $this->utility->echoJsonArray(0, "", ' file could not be downloaded');
    }

    public function generatePdf($html)
    {
        $this->load->library('pdf');
        $title = 'Transactions Report';
        $pdf = $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        // ob_start();
        // $pdf->SetFont('times', 11);
        $pdf->SetFont('helvetica', 11);
        $pdf->AddPage('P', 'A4');
        $pdf->SetAuthor('Increase Capital');
        $pdf->SetTitle($title);
        $pdf->SetHeaderMargin(10);
        $pdf->SetTopMargin(10);
        $pdf->setFooterMargin(0);
        $pdf->SetAutoPageBreak(true);
        $pdf->SetAuthor('Author');
        $pdf->SetDisplayMode('real', 'default');
        $pdf->setPageMark();
        $pdf->SetMargins(4, PDF_MARGIN_TOP, 4);
        $pdf->setPrintFooter(false);

        $pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE . ' 048', PDF_HEADER_STRING);


        $pdf->writeHTML($html, true, false, true, false, '');
        $filename = 'files/' . $this->utility->generateRandomString() . '.pdf';
        $path = FCPATH . $filename;

        $pdf->Output($path, 'F');
        return $filename;
        ob_end_clean();
    }


}