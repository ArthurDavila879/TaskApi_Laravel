<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Service\CepService;
use App\Service\UserService;
use Illuminate\Http\Request;

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
        return response()->json(['message' => "Usuario criado com sucesso"], 201);
    }

    public function update(Request $request, int $id)
    {
        $usuario = User::findOrFail($id);
        $this->authorize('update', $usuario);

        $dados = $request->validate([
            "name" => ["required", "string"],
            "email" => ["required", "email"],
        ]);

        $usuario = $this->service->update($dados, $id);
        return response()->json(new UserResource($usuario));
    }

    public function getById(int $id)
    {
        return new UserResource(User::findOrFail($id));
    }
      public function me(Request $request)
    {
        return new UserResource($request->user());
    }
   

    public function destroy(int $id)
    {
        $usuario = User::findOrFail($id);
        $this->authorize('delete', $usuario);

        $this->service->delete($id);
        return response()->json(['message' => 'Usuario removido com sucesso']);
    }

    public function endereco(Request $request)
    {
        $cep = $request->user()->cep;
        return $this->cepService->buscar($cep);
    }
    public function stats(Request $request)
{
    $user = User::find($request->user()->id);
    if($user->isadmin())
    return response()->json([
        'total_users' => \App\Models\User::count(),
        'total_tasks' => \App\Models\Task::count(),
    ]);
}
}
