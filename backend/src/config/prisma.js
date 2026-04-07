/**
 * Singleton do Prisma Client.
 * Garante uma única instância compartilhada de acesso ao banco.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma