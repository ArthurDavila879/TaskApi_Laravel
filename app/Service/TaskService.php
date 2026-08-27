<?php
namespace App\Service;

use App\Models\Task;
use App\Models\User;

class TaskService{

   public function listar(){
    return Task::all();
   }

   public function listarPorUsuario(int $userId){
    if(User::find($userId)->isAdmin()){
        return $this->listar();
    }
    return Task::where('user_id', $userId)->get();
   }

   public function create(array $data){
     $user = User::find($data['user_id']);
     $user->notify(new \App\Notifications\CadastroTarefa());
     return Task::create($data);
   }

   public function update(array $dados, int $id){
    $task = Task::findOrFail($id);

    if(isset($dados["title"])){
      $task->title = $dados["title"];
    }
    if(isset($dados["description"])){
      $task->description = $dados["description"];
    }
    if(isset($dados["status"])){
      $task->status = $dados["status"];
    }
    if(isset($dados["due_date"])){
      $task->due_date = $dados["due_date"];
    }

    $task->save();
    return $task;
   }

   public function delete(int $id){
    return Task::destroy($id);
   }
}
