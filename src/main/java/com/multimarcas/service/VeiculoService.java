package com.multimarcas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.multimarcas.dto.VeiculoDTO;
import com.multimarcas.entity.Veiculo;
import com.multimarcas.mapper.VeiculoMapper;
import com.multimarcas.repository.VeiculoRepository;
import com.multimarcas.util.ValidacaoVeiculo;



@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository repository;

    @Transactional(readOnly = true)
        public java.util.List<VeiculoDTO> listar(){
            return VeiculoMapper.toDTOList(repository.findAll());
    }


    @Transactional(readOnly = true)
        public VeiculoDTO buscarPorId (Long id){
            return repository.findById(id)
                    .map(VeiculoMapper::toDto)
                    .orElseThrow(() -> new RuntimeException("Veículo não encontrado."));
    
    }
    

    @Transactional
    public VeiculoDTO criar(VeiculoDTO dto){

        if (dto.getId() != null) {
            throw new IllegalArgumentException("Novo veículo não deve ter ID definido.");
        }

        if (!ValidacaoVeiculo.isPlacaValida(dto)) {
            throw new IllegalArgumentException("Placa inválida: " + dto.getPlaca());
        }

        if (repository.existsByPlaca(dto.getPlaca())) {
            throw new IllegalArgumentException("Placa já cadastrada: " + dto.getPlaca());
            
        }
        

        Veiculo salvo = repository.save(VeiculoMapper.toEntity(dto));
        dto.setId(salvo.getId());
        return dto;
    }
    
    @Transactional
    public VeiculoDTO atualizar(Long id, VeiculoDTO dto){
        if (dto.getId() == null) {
            throw new IllegalArgumentException("ID do veículo não pode ser nulo para atualização.");
        }

        Veiculo existente = repository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Veículo com ID " + dto.getId() + " não encontrado."));

        existente.setPlaca(dto.getPlaca());
        existente.setCor(dto.getCor());
        existente.setAno(dto.getAno());
        existente.setDescricao(dto.getDescricao());
        existente.setDataCadastro(dto.getDataCadastro());
        existente.setModelo(dto.getModelo());

        repository.save(existente);
        return VeiculoMapper.toDto(existente);
    }

    @Transactional
    public void deletar(Long id){

        if (!repository.existsById(id)) {
            throw new RuntimeException("Veículo não encontrado.");
        }

        repository.deleteById(id);
    }

    


   @Transactional(readOnly = true)
        public boolean buscarPorPlaca(String placa){
            return repository.existsByPlaca(placa);
        }

}

   // @Transactiona(readOnly = true)
    //    public List<VeiculoDTO> buscarporplacaParcial(String termo){
    //      if (termo == null || termo.isBlank()) {
     //       return listar();

     