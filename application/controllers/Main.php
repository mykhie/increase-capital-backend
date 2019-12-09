<?php
/**
 * Created by PhpStorm.
 * User: Osoro
 * Date: 12/9/2019
 * Time: 09:41
 */

date_default_timezone_set('Africa/Nairobi');

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: *");

class Main extends CI_Controller
{



    public function getAllCustomers($page = 0)
    {
        $search = $this->input->get('search');

        $whr['status'] = 1;
        $customers = $this->Customers->getAllCustomers($whr, $page, $search);

        if (count($customers) > 0) {


            $count = $this->Customers->getTotalCustomers($whr, $search);
            $this->utility->echoJsonArray(1, $customers, 'No customers available', array('totalPages' => ceil($count / PAGE_NUMBER_ITEMS), 'totalItems' => $count));
        } else {

            $this->utility->echoJsonArray(0, NULL, 'No customers available');
        }


    }

    public function saveCustomer()
    {
        $departmentDetails = $this->utility->returnArrayFromInput();
        $insertInfo = (array)$departmentDetails['saveData'];

        if (is_array($insertInfo)) {

            if (!isset($insertInfo['id'])) {

                $insert_id = $this->Customers->save($insertInfo);


                if ($insert_id > 0) {

                    $whereCustomer['id'] = $insert_id;
                    $up['customerCode'] = $this->utility->returnIncrementalCode($insert_id);
                    $this->Customers->update($whereCustomer, $up);

                    $this->utility->echoJsonArray(1, null, 'Customer saved successfully');
                } else {
                    $this->utility->echoJsonArray(0, null, 'Server error could not save,likely a duplicate');
                }
            } else {
                $whereCustomer['id'] = $insertInfo['id'];
                unset($insertInfo['id']);

                if ($this->Customers->update($whereCustomer, $insertInfo)) {
                    $this->utility->echoJsonArray(1, null, 'Customer updated successfully');
                } else {
                    $this->utility->echoJsonArray(0, null, 'Customer error could not update category');
                }


            }
        }

    }





}