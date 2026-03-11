import { Avatar } from "@/components/avatar";
import { AdminCreateUserForm } from "@/components/admin-create-user-form";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/time";

const ADMIN_ERRORS: Record<string, string> = {
  validation: "Проверьте заполнение формы.",
  identifier_taken: "Пользователь с таким ID уже существует.",
  username_taken: "Этот username уже занят.",
  avatar_too_large: "Фото слишком большое. Максимум 3 MB.",
  avatar_invalid_type: "Поддерживаются только JPG, PNG и WEBP.",
  avatar_upload_failed: "Не удалось загрузить фото. Попробуйте снова.",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>;
}) {
  const params = await searchParams;

  const users = await prisma.user.findMany({
    include: {
      profile: {
        select: {
          displayName: true,
          username: true,
          age: true,
          birthDate: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-5">
      <article className="rounded-2xl border border-[var(--line)] p-4">
        <h2 className="text-lg font-semibold">Создать аккаунт участника</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Аккаунты создаёт только администратор. Публичной регистрации нет.
        </p>

        {params.created ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Аккаунт успешно создан.
          </p>
        ) : null}
        {params.error ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            {ADMIN_ERRORS[params.error] ?? "Не удалось создать аккаунт."}
          </p>
        ) : null}

        <AdminCreateUserForm />
      </article>

      <article className="rounded-2xl border border-[var(--line)] p-4">
        <h2 className="text-lg font-semibold">Список аккаунтов</h2>
        {users.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">Пока нет пользователей.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--text-muted)]">
                  <th className="py-2 font-medium">Пользователь</th>
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Username</th>
                  <th className="py-2 font-medium">Роль</th>
                  <th className="py-2 font-medium">Возраст</th>
                  <th className="py-2 font-medium">Создан</th>
                </tr>
              </thead>
              <tbody>
                {users.map((account) => (
                  <tr key={account.id} className="border-b border-[var(--line)]/70">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={account.profile?.displayName ?? `ID ${account.identifier}`}
                          avatarUrl={account.profile?.avatarUrl}
                          size="sm"
                        />
                        <span>{account.profile?.displayName ?? `ID ${account.identifier}`}</span>
                      </div>
                    </td>
                    <td className="py-2 font-mono">{account.identifier}</td>
                    <td className="py-2 font-mono text-xs">
                      {account.profile?.username ? `@${account.profile.username}` : "—"}
                    </td>
                    <td className="py-2">{account.role}</td>
                    <td className="py-2">{account.profile?.age ?? "—"}</td>
                    <td className="py-2 text-xs text-[var(--text-muted)]">
                      {formatDateTime(account.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
