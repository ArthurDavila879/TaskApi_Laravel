<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;

class CepService
{
    public function buscar(string $cep): ?array
    {
        $cep = preg_replace('/\D/', '', $cep); // remove pontos/traços, deixa só números

        if (strlen($cep) !== 8) {
            return null;
        }

        $response = Http::timeout(5)->get("https://viacep.com.br/ws/{$cep}/json/");

        if ($response->failed()) {
            return null;
        }

        $dados = $response->json();

        // ViaCEP retorna {"erro": true} quando o CEP não existe, em vez de 404
        if (isset($dados['erro'])) {
            return null;
        }

        return $dados;
    }
}