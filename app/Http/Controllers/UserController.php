<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Service\CepService;
use App\Service\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    private UserService $service;
     private CepService $cepService;

    public function __construct(UserService $service, CepService $cepService)
    {
        $this->service = $service;
        $this->cepService = $cepService;
    }

    public function index()
    {
        return UserResource::collection($this->service->listar());
    }

    public function store(StoreUserRequest $request)
    {

        $dados = $request->validated();

        $this->service->create($dados);
        return response()->json(['message'=>"Usuario criado com sucesso"],201);
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            "name" => ["required", "string"],
            "email" => ["required", "email"],
        ]);

        $usuario =  $this->service->update($dados, $id);
         return response()->json([new UserResource($usuario)],201);

    }
    public function getById(int $id){
        return new UserResource($this->service->getById($id));
    }
    public function destroy(int $id){
        $delet = $this->service->delete($id);
         return response()->json(200);

    }
       public function endereco(Request $request){
        $cep = $request->user()->cep;
        return $this->cepService->buscar($cep);
    }
}
