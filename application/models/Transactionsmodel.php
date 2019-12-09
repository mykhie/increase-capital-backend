<?php
/**
 * Created by PhpStorm.
 * User: Osoro
 * Date: 12/9/2019
 * Time: 12:19
 */

class Transactionsmodel extends CI_Model
{

    public $table = 'Transactions';

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllTransactions($whr, $page, $search = "")
    {
        $this->db->where($whr);

        if (strlen($search) > 0) {
            $this->db->where("(code LIKE '%$search%')");
        }

        if ($page > -1)
            $this->db->limit(PAGE_NUMBER_ITEMS, $page * PAGE_NUMBER_ITEMS);

        $this->db->order_by('id', 'desc');

        $q = $this->db->get($this->table);
        return $q->result_array();

    }

    public function getTotalTransactions($whr, $search)
    {
        $q = $this->db->select('count(*) as count');

        if (strlen($search) > 0) {
            $this->db->where("(idNo LIKE '%$search%')");
        }
        $this->db->where($whr);


        $q = $this->db->get($this->table);

        $count = $q->result_array();
        return $count[0]['count'];
    }

    public function save($in)
    {

        try {
            $this->db->insert($this->table, $in);
            $insert_id = $this->db->insert_id();
        } catch (Exception $e) {
            $insert_id = null;
        }
        return $insert_id;
    }

    public function update($where, $up)
    {

        $query = $this->db->where($where)->update($this->table, $up);
        if ($query) {
            return true;
        } else {
            return FALSE;
        }
    }


}