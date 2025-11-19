package com.multimarcas.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.multimarcas.dto.VeiculoDTO;
import com.multimarcas.service.VeiculoService;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoService service;

    // Listar todos os veículos
    @GetMapping
    public ResponseEntity<List<VeiculoDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    // Buscar veículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<VeiculoDTO> buscar(@PathVariable Long id) {
        VeiculoDTO veiculo = service.buscarPorId(id);
        return ResponseEntity.ok(veiculo);
    }

    // Criar novo veículo
    @PutMapping
    public ResponseEntity<VeiculoDTO> criar(@RequestBody VeiculoDTO dto) {
        VeiculoDTO criado = service.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.getId())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    // Atualizar veículo por ID
    @PutMapping("/{id}")
    public ResponseEntity<VeiculoDTO> atualizar(@PathVariable Long id, @RequestBody VeiculoDTO dto) {
        VeiculoDTO atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    // Deletar veículo por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // Verificar se placa existe
    @GetMapping("/existe/{placa}")
    public ResponseEntity<Boolean> existePorPlaca(@PathVariable String placa) {
        boolean existe = service.buscarPorPlaca(placa);
        return ResponseEntity.ok(existe);
    }

    // Buscar veículos por parte da placa (opcional)
    // @GetMapping("/placa/{placa}")
    // public ResponseEntity<List<VeiculoDTO>> buscarPorPartePlaca(@PathVariable String placa) {
    //     return ResponseEntity.ok(service.buscarPorPlacaParcial(placa));
    // }
}
