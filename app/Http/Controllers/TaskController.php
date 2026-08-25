<?php

namespace App\Http\Controllers;

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
        return $this->service->listar();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dados = $request->all();
        return $this->service->create($dados);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
