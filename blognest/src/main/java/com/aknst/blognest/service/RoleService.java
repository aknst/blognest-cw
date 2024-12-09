package com.aknst.blognest.service;

import com.aknst.blognest.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {

    List<Role> getRoles();

    Role saveRole(Role role);

    Optional<Role> findRoleByName(String name);

    boolean roleExistsByName(String name);

    void saveRoles(List<Role> roles);
}
