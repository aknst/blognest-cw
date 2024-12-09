package com.aknst.blognest.service.impl;

import com.aknst.blognest.model.Role;
import com.aknst.blognest.repository.RoleRepository;
import com.aknst.blognest.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> findRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public boolean roleExistsByName(String name) {
        return roleRepository.findByName(name).isPresent();
    }

    @Override
    public void saveRoles(List<Role> roles) {
        roleRepository.saveAll(roles);
    }
}