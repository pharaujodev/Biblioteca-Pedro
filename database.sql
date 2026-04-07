CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'cliente'
);

INSERT INTO usuarios (nome, email, senha, role) VALUES
('Pedro Henrique de Araujo Pereira', 'phenriqueapereira@outlook.com', '$2b$10$ZkI8rVA0UiqXq5JmB7LNT.DyUePb/R8CgaQ/sF3HwOu3F6mvcK.IW', 'admin');

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_publicacao INT NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    paginas INT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    disponivel VARCHAR(20) NOT NULL DEFAULT 'disponível',
    capa VARCHAR(255),
    quantidade INT NOT NULL DEFAULT 1
);

INSERT INTO livros (titulo, autor, ano_publicacao, isbn, paginas, categoria, disponivel, capa, quantidade) VALUES
('Homem-Aranha', 'Stan Lee', 1962, '978-3-16-148410-0', 32, 'Super-herói', 'disponível', '/img/homem.jpg', 10),
('Harry Potter e a Câmara Secreta', 'J.K. Rowling', 1998, '978-0-7475-3849-2', 341, 'Fantasia', 'disponível', '/img/camara-secreta.jpg', 10),
('Harry Potter e o Prisioneiro de Azkaban', 'J.K. Rowling', 1999, '978-0-7475-4215-2', 435, 'Fantasia', 'disponível', '/img/prisioneiro-azkaban.jpg', 10),
('Harry Potter e o Cálice de Fogo', 'J.K. Rowling', 2000, '978-0-7475-4624-2', 636, 'Fantasia', 'disponível', '/img/calice-fogo.jpg', 10),
('Harry Potter e a Ordem da Fênix', 'J.K. Rowling', 2003, '978-0-7475-5100-3', 766, 'Fantasia', 'disponível', '/img/ordem-fenix.jpg', 10),
('Harry Potter e o Enigma do Príncipe', 'J.K. Rowling', 2005, '978-0-7475-8108-6', 607, 'Fantasia', 'disponível', '/img/enigma-principe.jpg', 10),
('Harry Potter e as Relíquias da Morte', 'J.K. Rowling', 2007, '978-0-7475-9105-1', 759, 'Fantasia', 'disponível', '/img/reliquias-morte.jpg', 10);

CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_livro) REFERENCES livros(id)
);

CREATE TABLE IF NOT EXISTS solicitacaoEmprestimo (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    data_solicitacao TIMESTAMP DEFAULT NOW() NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_livro) REFERENCES livros(id)
)