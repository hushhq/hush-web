import * as React from "react"
import {
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface UserMenuProps {
  user: { name: string; email: string; initials: string }
  onOpenSettings?: () => void
  onSignOut?: () => void | Promise<void>
}

export function UserMenu({ user, onOpenSettings, onSignOut }: UserMenuProps) {
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [logoutBusy, setLogoutBusy] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onOpenSettings?.()}>
                <SettingsIcon className="size-4" />
                Preferences
              </DropdownMenuItem>
              {/* Notifications has no per-user prefs backend yet — render
                  disabled to keep parity with the prototype. */}
              <DropdownMenuItem disabled>
                <BellIcon className="size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                // Defer to next tick so the DropdownMenu finishes its
                // close + body pointer-events restore before the
                // AlertDialog mounts. Stacking two Radix overlays leaks
                // the body lock on dismiss and freezes the UI until
                // a hard reload.
                setTimeout(() => setLogoutOpen(true), 0)
              }}
            >
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out on this device. Active voice calls will
              disconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={logoutBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={logoutBusy}
              onClick={(event) => {
                event.preventDefault()
                if (!onSignOut) {
                  setLogoutOpen(false)
                  return
                }
                // Close the dialog before the awaited signout so the
                // Radix portal cleanup completes before the auth flow
                // unmounts this tree. Same close-before-await pattern
                // used elsewhere for destructive actions.
                setLogoutOpen(false)
                setLogoutBusy(true)
                Promise.resolve(onSignOut()).finally(() => setLogoutBusy(false))
              }}
            >
              {logoutBusy ? "Logging out..." : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenu>
  )
}
