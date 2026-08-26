<?php
namespace App\Service;

use App\Models\Task;

class TaskService{

   public function listar(){
    return Task::all();
   }
   public function create(array $data){
     return Task::create($data); 
   }
   public function update(array $dados, int $id){
    if(!Task::find($id)){
      return response()->json(404);
    }
    $task = Task::find($id);

    if(isset($dados["title"])){
      $task->title = $dados["title"];
    }
    if(isset($dados["description"])){
      $task->description = $dados["description"];
    }
    if(isset($dados["status"])){
      $task->status = $dados["status"];
    }
    
     return $task->update();

   }
   public function delete(int $id){
   
    if(!Task::find($id)){
      return response()->json(404);
    }
    return Task::destroy($id);
   }
}