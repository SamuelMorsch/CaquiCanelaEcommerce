-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06/12/2025 às 04:53
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `caquicanela`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `address`
--

CREATE TABLE `address` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `street` varchar(255) NOT NULL,
  `number` varchar(20) NOT NULL,
  `complement` varchar(100) DEFAULT NULL,
  `neighborhood` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(50) NOT NULL,
  `zip` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `address`
--

INSERT INTO `address` (`id`, `user_id`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zip`, `created_at`, `updated_at`) VALUES
(2, 6, 'Rua das Matas', '1234', '', 'Centro', 'Porto Alegre', 'SC', '89270000', '2025-11-29 17:19:59', '2025-12-04 01:44:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `order`
--

CREATE TABLE `order` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `shipping_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','paid','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `placed_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `order`
--

INSERT INTO `order` (`id`, `user_id`, `total_amount`, `shipping_amount`, `status`, `placed_at`, `updated_at`) VALUES
(46, 2, 389.80, 42.90, 'shipped', '2025-12-04 23:32:27', '2025-12-04 23:35:17'),
(47, 2, 189.90, 42.90, 'shipped', '2025-12-04 23:44:22', '2025-12-04 23:45:53'),
(48, 6, 369.80, 42.90, 'pending', '2025-12-04 23:55:08', '2025-12-04 23:55:08'),
(49, 6, 389.80, 42.90, 'pending', '2025-12-04 23:57:49', '2025-12-04 23:57:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `order_item`
--

CREATE TABLE `order_item` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(27, 46, 17, 1, 189.90, 189.90),
(28, 46, 16, 1, 199.90, 199.90),
(29, 47, 17, 1, 189.90, 189.90),
(30, 48, 15, 1, 169.90, 169.90),
(31, 48, 16, 1, 199.90, 199.90),
(32, 49, 16, 1, 199.90, 199.90),
(33, 49, 17, 1, 189.90, 189.90);

-- --------------------------------------------------------

--
-- Estrutura para tabela `payment`
--

CREATE TABLE `payment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `method` enum('pix','credit_card','boleto','other') NOT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','authorized','captured','failed','refunded') DEFAULT 'pending',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `product`
--

CREATE TABLE `product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(80) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` varchar(512) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `category` varchar(100) DEFAULT 'Geral'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `product`
--

INSERT INTO `product` (`id`, `sku`, `name`, `slug`, `short_description`, `description`, `price`, `active`, `created_at`, `updated_at`, `category`) VALUES
(14, 'VES-001', 'Vestido Midi Terracotta em Linho', 'vestido-midi-terracotta-linho-botoes', NULL, 'Elegância natural com toque rústico. Este vestido midi em tom terracota possui modelagem ampla e confortável, confeccionado em tecido com aspecto de linho. Com abotoamento frontal funcional e mangas 3/4, é a peça perfeita para transitar entre o clássico e o despojado com leveza.', 249.99, 1, '2025-12-04 19:18:21', '2025-12-04 19:29:11', 'Vestidos'),
(15, 'BLU-001', 'Blusa Manga Longa em Linho Rústico', 'blusa-manga-longa-linho-verde-oliva', NULL, 'Blusa solta com gola alta e detalhes franzidos no pescoço. O tom verde oliva e a textura de linho trazem um ar natural e elegante à peça.', 169.90, 1, '2025-12-04 20:05:37', '2025-12-04 20:07:14', 'Blusas'),
(16, 'CAL-001', 'Calça Wide Leg em Linho Rústico', 'calca-wide-leg-linho-off-white', NULL, 'Calça de cintura alta com modelagem ampla e corte reto. O tom terroso e a textura de linho garantem elegância e conforto para compor looks naturais.', 199.90, 1, '2025-12-04 20:14:11', '2025-12-04 20:46:02', 'Calças'),
(17, 'SAI-001', 'Saia Midi em Linho com Botões Laterais', 'saia-midi-linho-botoes-azul-marinho', NULL, 'Saia midi de cintura alta em tom azul marinho profundo. Possui modelagem evasê, bolsos funcionais e uma fileira de botões de madeira na lateral que traz um charme vintage.', 189.90, 1, '2025-12-04 20:31:52', '2025-12-04 20:45:50', 'Saias');

-- --------------------------------------------------------

--
-- Estrutura para tabela `stock`
--

CREATE TABLE `stock` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `minimum_stock` int(11) DEFAULT 0,
  `last_updated` datetime NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `stock`
--

INSERT INTO `stock` (`id`, `product_id`, `size`, `color`, `quantity`, `minimum_stock`, `last_updated`, `imageUrl`) VALUES
(16, 14, 'M', 'Terracota', 15, 0, '2025-12-04 20:36:15', 'http://localhost:3000/uploads/productImage-1764880575337-639441548.png'),
(17, 14, 'P', 'Azul', 10, 0, '2025-12-04 20:36:16', 'http://localhost:3000/uploads/productImage-1764880576690-470908605.png'),
(18, 15, 'M', 'Verde Oliva', 13, 0, '2025-12-04 20:05:37', 'http://localhost:3000/uploads/productImage-1764878737886-121911472.png'),
(19, 15, 'G', 'Terracota', 9, 0, '2025-12-04 20:06:20', 'http://localhost:3000/uploads/productImage-1764878780189-786455972.png'),
(20, 16, 'M', 'Off-White', 7, 0, '2025-12-04 20:14:11', 'http://localhost:3000/uploads/productImage-1764879251895-973232381.png'),
(21, 16, 'M', 'Terracota', 8, 0, '2025-12-04 20:15:13', 'http://localhost:3000/uploads/productImage-1764879313182-381025142.png'),
(22, 16, 'P', 'Off-White', 5, 0, '2025-12-04 20:16:51', 'http://localhost:3000/uploads/productImage-1764879411132-341748729.png'),
(23, 16, 'G', 'Off-White', 4, 0, '2025-12-04 20:17:40', 'http://localhost:3000/uploads/productImage-1764879460204-73014991.png'),
(24, 17, 'M', 'Azul Marinho', 6, 0, '2025-12-04 20:31:52', 'http://localhost:3000/uploads/productImage-1764880312537-708459012.png'),
(25, 17, 'M', 'Bege Natural', 7, 0, '2025-12-04 20:32:41', 'http://localhost:3000/uploads/productImage-1764880361573-417576170.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('customer','admin','owner') DEFAULT 'customer',
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `user`
--

INSERT INTO `user` (`id`, `role`, `name`, `email`, `password_hash`, `phone`, `active`, `created_at`, `updated_at`) VALUES
(1, 'owner', 'Graziela - CaquiCanela', 'contato@caquicanela.com', '$2b$10$3ww4NSWXqyOHDmMvAiCJaOax6NQM8F41py0QTXuP7vjpOFn4C2fFm', NULL, 1, '2025-11-07 18:45:55', '2025-11-07 18:45:55'),
(2, 'admin', 'samuel morsch', 'testesamuel@gmail.com', '$2b$10$KQVMnJq.Y6dSj3WStP6bVObvS2Jz/H/pjqguHIQYMnew0R7WJvy/u', NULL, 1, '2025-11-07 19:25:33', '2025-11-07 19:25:33'),
(6, 'customer', 'Juca Teste 2', 'jucateste2@gmail.com', '$2b$10$ObGotKuDzhbA7B4W5BbuKeVjSDEX3t.agWwq3KabZy/cVHBTWJhue', '41987125544', 1, '2025-11-29 17:19:59', '2025-11-29 17:19:59');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices de tabela `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices de tabela `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices de tabela `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Índices de tabela `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `sku_7` (`sku`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `sku_8` (`sku`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `sku_9` (`sku`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `sku_10` (`sku`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `sku_11` (`sku`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `sku_12` (`sku`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `sku_13` (`sku`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `sku_14` (`sku`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `sku_15` (`sku`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `sku_16` (`sku`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `sku_17` (`sku`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `sku_18` (`sku`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `sku_19` (`sku`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `sku_20` (`sku`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `sku_21` (`sku`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `sku_22` (`sku`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `sku_23` (`sku`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `sku_24` (`sku`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `sku_25` (`sku`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `sku_26` (`sku`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `sku_27` (`sku`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `sku_28` (`sku`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `sku_29` (`sku`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `sku_30` (`sku`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `sku_31` (`sku`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `sku_32` (`sku`),
  ADD UNIQUE KEY `slug_32` (`slug`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`);

--
-- Índices de tabela `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `address`
--
ALTER TABLE `address`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `order`
--
ALTER TABLE `order`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de tabela `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de tabela `payment`
--
ALTER TABLE `payment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `stock`
--
ALTER TABLE `stock`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Restrições para tabelas `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Restrições para tabelas `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_51` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_52` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Restrições para tabelas `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Restrições para tabelas `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
