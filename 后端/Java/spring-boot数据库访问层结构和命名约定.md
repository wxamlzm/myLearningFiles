# Spring Boot 数据库访问层结构和命名约定

## 1. 包结构

数据库访问层主要包含在 `repository` 包中。假设您的基础包名为 `com.yourcompany.yourproject`，结构如下：

```
com.yourcompany.yourproject
└── repository
    ├── UserRepository.java
    ├── PostRepository.java
    └── CommentRepository.java
```

## 2. 命名约定

- 接口名通常以实体名称开头，以 "Repository" 结尾。
- 方法名应该清晰地表达其功能。

## 3. 示例

### 3.1 UserRepository

```java
package com.yourcompany.yourproject.repository;

import com.yourcompany.yourproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByEmail(String email);
    List<User> findByAgeGreaterThan(int age);
}
```

### 3.2 PostRepository

```java
package com.yourcompany.yourproject.repository;

import com.yourcompany.yourproject.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorId(Long authorId);
    List<Post> findByTitleContaining(String keyword);
    
    @Query("SELECT p FROM Post p WHERE p.author.id = ?1 AND p.published = true")
    List<Post> findPublishedPostsByAuthor(Long authorId);
}
```

### 3.3 CommentRepository

```java
package com.yourcompany.yourproject.repository;

import com.yourcompany.yourproject.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);
    long countByPostId(Long postId);
}
```

## 4. 关键点

1. 继承 `JpaRepository`：提供了基本的 CRUD 操作。
2. 泛型参数：第一个是实体类型，第二个是主键类型。
3. 方法命名：遵循 Spring Data JPA 的命名约定，自动生成相应的查询。
4. `@Query` 注解：用于复杂查询，可以使用 JPQL 或原生 SQL。
5. `@Repository` 注解：标记这是一个 Spring 管理的数据访问组件。

## 5. 最佳实践

1. 保持接口简洁，只包含必要的方法。
2. 利用 Spring Data JPA 的方法命名约定。
3. 对于复杂查询，使用 `@Query` 注解。
4. 考虑添加自定义方法的注释，特别是对于复杂查询。
5. 对于大型项目，可以考虑创建基础 Repository 接口。

通过遵循这些约定和最佳实践，您可以创建一个清晰、一致且易于维护的数据访问层。
