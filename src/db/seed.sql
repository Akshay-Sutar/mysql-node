CREATE TABLE `employees`. `department` ( `id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NULL, `created_at` DATETIME NULL, `updated_at` DATETIME NULL, PRIMARY KEY(`id`), INDEX `id` (`id` ASC));

CREATE TABLE `employees`. `employee` ( `id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NULL, `code` VARCHAR(10) NULL, `salary` DECIMAL(10, 2) NULL, `dept_id` INT NULL, `manager_id` INT NULL, `created_at` DATETIME NULL, `updated_at` DATETIME NULL, `hired_date` DATE NULL, PRIMARY KEY(`id`), INDEX `Key1` (`dept_id` ASC), INDEX `Key2` (`manager_id` ASC), CONSTRAINT `fkey1` FOREIGN KEY(`dept_id`) REFERENCES `employees`. `department` (`id`)
ON
DELETE NO ACTION
ON UPDATE NO ACTION) COMMENT = ' ';