<?php

namespace App\Service;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService{
   
public function listar(){
        return User::all();
    }

    public function create(array $user){
        $hashed = Hash::make($user["password"], [
            'rounds' => 12,
        ]);
        $user["password"] = $hashed;
        
        return User::create($user);
    }
    public function update(array $dados, int $id){
       $usuario = User::find($id);
       if(!$usuario){
        return null;
       }
        $usuario->update($dados);
        return $usuario;
    }
    public function getById(int $id){
        return User::find($id);
    }
    public function delete(int $id){
        $usuario = User::find($id);
        if(!$usuario){
            return null;
        }
        return $usuario->delete();
    }
 
}