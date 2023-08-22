import { data } from "src/data";
import { Subscription } from "src/dtos/shared/types";

export function isUserExist(scope: Subscription, pseudo: string, email: string, phone: string) {
  const user = data.users
      .filter((users) => users.scope === scope)
      .find((user) => user.email === email || user.phone === phone || user.pseudo === pseudo)

  return user === undefined ? false : true
}