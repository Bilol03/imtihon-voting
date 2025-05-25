import { ForbiddenException } from '@nestjs/common';

export function checkAdmin(user: { role: string }) {
  if (user.role !== 'admin') {
    throw new ForbiddenException('Only admins can perform this action');
  }
}
