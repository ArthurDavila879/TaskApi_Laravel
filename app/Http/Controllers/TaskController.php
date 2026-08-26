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

    public function index()
    {
        
        return TaskResource::collection($this->service->listar());
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
        return $this->service->update($dados,$id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $task = Task::findOrFail($id);
        $this->authorize('delete', $task);
        return $this->service->delete($id);
    }
}
