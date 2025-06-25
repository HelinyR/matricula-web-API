-- Tabela para Supervisores
CREATE TABLE Supervisores (
    supervisor_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Armazenando senhas com hash
    nome VARCHAR(255),
    cpf VARCHAR(11),
    endereco VARCHAR(255),
    telefone VARCHAR(255)
) ENGINE=InnoDB;

-- Tabela para Atendentes
CREATE TABLE Atendentes (
    atendente_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Armazenando senhas com hash
    nome VARCHAR(255),
    cpf VARCHAR(11),
    endereco VARCHAR(255),
    telefone VARCHAR(255)
) ENGINE=InnoDB;

-- Tabela para Candidatos
CREATE TABLE Candidatos (
    candidato_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE, 
    matricula VARCHAR(50) UNIQUE, -- "matrícula"
    curso VARCHAR(255),
    turno VARCHAR(100)
) ENGINE=InnoDB;

-- Tabela para Matrículas
CREATE TABLE Matriculas (
    matricula_id INT PRIMARY KEY AUTO_INCREMENT,
    atendente_id INT NOT NULL,
    candidato_id INT NOT NULL,
    data_matricula DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendente_id) REFERENCES Atendentes(atendente_id),
    FOREIGN KEY (candidato_id) REFERENCES Candidatos(candidato_id)
) ENGINE=InnoDB;

-- Tabela para Desempenho Mensal
CREATE TABLE DesempenhoMensal (
    desempenho_id INT PRIMARY KEY AUTO_INCREMENT,
    atendente_id INT NOT NULL,
    mes_ano DATE NOT NULL, -- Armazenado como AAAA-MM-01 para acompanhamento mensal
    metas_matriculas INT,
    matriculas_realizadas INT DEFAULT 0,
    comissao_total_ganha DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (atendente_id) REFERENCES Atendentes(atendente_id),
    UNIQUE (atendente_id, mes_ano) -- Garante apenas uma entrada por atendente por mês
) ENGINE=InnoDB;