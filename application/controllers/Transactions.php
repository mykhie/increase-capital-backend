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

class Transactions extends CI_Controller
{


    public function getAllTransactions($page = 0,$customerId,$type)
    {
        $search = $this->input->get('search');

        $whr['status'] = 1;

        if(is_numeric($customerId)){
            $whr['customerId'] = $customerId;
        }
        if(is_numeric($type)){
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

    public function saveTransaction()
    {
        $departmentDetails = $this->utility->returnArrayFromInput();
        $insertInfo = (array)$departmentDetails['saveData'];

        if (is_array($insertInfo)) {

            if (!isset($insertInfo['id'])) {

                $insert_id = $this->Transactionsmodel->save($insertInfo);


                if ($insert_id > 0) {

                    $whereCustomer['id'] = $insert_id;
                    $up['code'] = $this->utility->returnIncrementalCode($insert_id);
                    $this->Transactionsmodel->update($whereCustomer, $up);

                    $this->utility->echoJsonArray(1, null, 'Transacrion saved successfully');
                } else {
                    $this->utility->echoJsonArray(0, null, 'Server error could not save,likely a duplicate');
                }
            } else {
                $whereCustomer['id'] = $insertInfo['id'];
                unset($insertInfo['id']);

                if ($this->Transactionsmodel->update($whereCustomer, $insertInfo)) {
                    $this->utility->echoJsonArray(1, null, 'Loan updated successfully');
                } else {
                    $this->utility->echoJsonArray(0, null, 'Loan error could not update category');
                }


            }
        }

    }


}