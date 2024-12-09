package com.aknst.blognest.runner;

import com.aknst.blognest.model.*;
import com.aknst.blognest.service.PostService;
import com.aknst.blognest.service.RoleService;
import com.aknst.blognest.service.TagService;
import com.aknst.blognest.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final TagService tagService;
    private final PostService postService;

    @Override
    public void run(String... args) {
        if (roleService.getRoles().isEmpty()) {
            roleService.saveRole(new Role(null, "ROLE_USER"));
            roleService.saveRole(new Role(null, "ROLE_ADMIN"));
            log.info("Roles initialized");
        }

        if (!userService.getUsers().isEmpty()) {
            return;
        }

        List<Role> allRoles = roleService.getRoles();
        Set<Role> rolesSet = new HashSet<>(allRoles);
        Set<Role> userRole = new HashSet<>();
        Role user = allRoles.stream().filter(role -> "ROLE_USER".equals(role.getName())).findFirst().get();
        userRole.add(user);

        User admin = new User(null, "admin", "admin", "Admin", "admin@mycompany.com", rolesSet);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        userService.saveUser(admin);
        log.info("Database initialized");

        admin = userService.getUserByUsername("admin").get();
        Blog blogAdmin = admin.getBlog();

        Tag tagJava = tagService.saveTag(new Tag(null, "Java"));
        Tag tagSpring = tagService.saveTag(new Tag(null, "Spring"));
        Tag tagProgramming = tagService.saveTag(new Tag(null, "Программирование"));
        Tag tagBooks = tagService.saveTag(new Tag(null, "Книги"));
        Tag tagArt = tagService.saveTag(new Tag(null, "Искусство"));
        Tag tagTech = tagService.saveTag(new Tag(null, "Военная техника"));


        User userBooks = new User(null, "bookworm", "password123", "Иван", "ivan@books.com", userRole);
        userBooks.setPassword(passwordEncoder.encode(userBooks.getPassword()));
        userService.saveUser(userBooks);
        Blog blogBooks = userBooks.getBlog();

        Post postBooks1 = new Post();
        postBooks1.setTitle("Лучшие книги для программистов");
        postBooks1.setBrief("Обзор лучших книг для развития программиста.");
        postBooks1.setContent("В этом посте мы рассмотрим несколько книг, которые помогут стать отличным программистом...");
        postBooks1.setTags(Set.of(tagBooks));
        postBooks1.setBlog(blogBooks);
        postBooks1.setAuthor(userBooks);

        Post postBooks2 = new Post();
        postBooks2.setTitle("10 книг, которые стоит прочитать каждому");
        postBooks2.setBrief("Независимо от профессии, эти книги станут полезными для любого человека.");
        postBooks2.setContent("От классической литературы до современных произведений — в этом списке каждый найдёт книгу по душе...");
        postBooks2.setTags(Set.of(tagBooks));
        postBooks2.setBlog(blogBooks);
        postBooks2.setAuthor(userBooks);

        User userArt = new User(null, "Artist", "password123", "Мария", "maria@art.com", userRole);
        userArt.setPassword(passwordEncoder.encode(userArt.getPassword()));
        userService.saveUser(userArt);
        Blog blogArt = userArt.getBlog();

        Post postArt1 = new Post();
        postArt1.setTitle("Великие художники эпохи Ренессанса");
        postArt1.setBrief("Знакомство с великими художниками, чьи работы изменили мир искусства.");
        postArt1.setContent("В этом посте мы расскажем о великих мастерах Ренессанса, таких как Леонардо да Винчи и Микеланджело...");
        postArt1.setTags(Set.of(tagArt));
        postArt1.setBlog(blogArt);
        postArt1.setAuthor(userArt);

        Post postArt2 = new Post();
        postArt2.setTitle("Современное искусство: что это?");
        postArt2.setBrief("Что такое современное искусство и какие тенденции актуальны сегодня?");
        postArt2.setContent("Современное искусство включает в себя различные жанры, от абстракционизма до инсталляций...");
        postArt2.setTags(Set.of(tagArt));
        postArt2.setBlog(blogArt);
        postArt2.setAuthor(userArt);

        User userIT = new User(null, "arefev.k.v", "password123", "Константин", "arefev.k.v@edu.mirea.ru", userRole);
        userIT.setPassword(passwordEncoder.encode(userIT.getPassword()));
        userService.saveUser(userIT);
        Blog blogIT = userIT.getBlog();

        Post postIT1 = new Post();
        postIT1.setTitle("Основы Spring Framework");
        postIT1.setBrief("Обзор ключевых особенностей Spring Framework для начинающих.");
        postIT1.setContent("Spring Framework — это мощная платформа для разработки Java-приложений. В этом посте мы рассмотрим его основные компоненты...");
        postIT1.setTags(Set.of(tagJava, tagSpring, tagProgramming));
        postIT1.setBlog(blogIT);
        postIT1.setAuthor(userIT);

        Post postIT2 = new Post();
        postIT2.setTitle("Лучшие практики в Java");
        postIT2.setBrief("Какие принципы и практики помогут вам стать лучшим Java-разработчиком?");
        postIT2.setContent("Мы обсудим важные практики, такие как принцип SOLID, использование паттернов проектирования и тестирование...");
        postIT2.setTags(Set.of(tagJava));
        postIT2.setBlog(blogIT);
        postIT2.setAuthor(userIT);

        User userTech = new User(null, "military", "password123", "Дмитрий", "dmitry@tech.com", userRole);
        userTech.setPassword(passwordEncoder.encode(userTech.getPassword()));
        userService.saveUser(userTech);
        Blog blogTech = userTech.getBlog();

        Post postTech1 = new Post();
        postTech1.setTitle("Современные танки: что изменилось?");
        postTech1.setBrief("Технологические новшества в мире современных танков.");
        postTech1.setContent("Мы рассмотрим новейшие разработки в области танков, такие как улучшенная броня и системы управления огнём...");
        postTech1.setTags(Set.of(tagTech));
        postTech1.setBlog(blogTech);
        postTech1.setAuthor(userTech);

        Post postTech2 = new Post();
        postTech2.setTitle("История военной авиации");
        postTech2.setBrief("Этапы развития авиации в военных действиях.");
        postTech2.setContent("От первых летательных аппаратов до современных истребителей, развитие авиации имеет огромное значение...");
        postTech2.setTags(Set.of(tagTech));
        postTech2.setBlog(blogTech);
        postTech2.setAuthor(userTech);

        // Сохранение всех пользователей и постов
        postService.savePost(postBooks1);
        postService.savePost(postBooks2);
        postService.savePost(postTech1);
        postService.savePost(postArt1);
        postService.savePost(postIT1);
        postService.savePost(postIT2);
        postService.savePost(postTech2);
        postService.savePost(postArt2);

        userBooks.getBlog().setTitle("Книги и литература");
        userArt.getBlog().setTitle("Искусство и культура");
        userIT.getBlog().setTitle("IT и Программирование");
        userTech.getBlog().setTitle("Военная техника");
        userBooks.getBlog().setDescription("Блог о лучших книгах, литературных произведениях и книгах для профессионалов.");
        userTech.getBlog().setDescription("Здесь обсуждаются различные виды военной техники, от танков до авиации.");
        userArt.getBlog().setDescription("Здесь вы найдете посты о великих художниках, произведениях искусства и современных трендах в мире искусства.");
        userIT.getBlog().setDescription("Блог о программировании, Java, Spring и других технологиях для разработки ПО.");

        userService.saveUser(userBooks);
        userService.saveUser(userArt);
        userService.saveUser(userTech);
        userService.saveUser(userIT);
        log.info("Sample posts added to users' blogs");
    }
}
