<?php

namespace App\Http\Controllers;

use App\Service\CepService;
use Illuminate\Http\Request;

class CepController extends Controller
{
    private CepService $service;

    public function __construct(CepService $service)
    {
        $this->service = $service;
    }

    public function show(string $cep)
    {
        $dados = $this->service->buscar($cep);

        if (!$dados) {
            return response()->json(['message' => 'CEP não encontrado ou inválido'], 404);
        }

        return response()->json($dados);
    }
}