<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Service\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    private TaskService $service;
    public function __construct(TaskService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        // antes: Task::all() — retornava as tasks de TODO MUNDO.
        // agora: só as tasks do usuário autenticado.
        return TaskResource::collection(
            $this->service->listarPorUsuario($request->user()->id)
        );
    }

    public function show(Request $request, int $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('view', $task);

        return new TaskResource($task);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $dados = $request->validated();
        $dados["user_id"] = $request->user()->id;
        
        return new TaskResource($this->service->create($dados));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, int $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('update', $task);
        $dados = $request->validated();

        return new TaskResource($this->service->update($dados, $id));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('delete', $task);

        $this->service->delete($id);
        return response()->json(['message' => 'Task removida com sucesso']);
    }

    // Mantido por compatibilidade — agora protegido pelo grupo auth:sanctum no routes/api.php.
    // Faz a mesma coisa que o index() já faz sozinho; pode ser removido quando não precisar mais dele.
    public function getTaskByUser(Request $request)
    {
        $userId = $request->user()->id;
        $tasks = Task::where('user_id', $userId)->get();
        return TaskResource::collection($tasks);
    }
}
