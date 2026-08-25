<?php
namespace App\Service;

use App\Models\Task;

class TaskService{

   public function listar(){
    return Task::all();
   }
   public function create(array $data){
     $data = Task::create($data);
   }
}