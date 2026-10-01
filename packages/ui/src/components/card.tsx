import * as React from "react"
import { cn } from "../lib/cn"
/** Use for a bordered surface that groups related content. For a number with a label use StatCard or KpiStrip instead; for a tappable settings row use ListGroup/ListRow instead. */
export const Card = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...p} />
/** Use for the title block at the top of a Card (holds CardTitle + CardDescription). For a page-level title use PageHeader instead. */
export const CardHeader = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("flex flex-col gap-1 p-5 pb-3", className)} {...p} />
/** Use for the heading inside a CardHeader. For a dialog heading use DialogTitle instead. */
export const CardTitle = ({ className, ...p }: React.ComponentProps<"h3">) => <h3 className={cn("text-base font-bold leading-snug", className)} {...p} />
/** Use for one muted line under a CardTitle. For longer help text put a <p> in CardContent instead. */
export const CardDescription = ({ className, ...p }: React.ComponentProps<"p">) => <p className={cn("text-sm text-muted-foreground", className)} {...p} />
/** Use for the main body of a Card. For a full table inside a card use DataTable directly instead of nesting padding. */
export const CardContent = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("p-5 pt-0", className)} {...p} />
/** Use for the action row at the bottom of a Card. For dialog actions use DialogFooter instead. */
export const CardFooter = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("flex items-center gap-2 p-5 pt-0", className)} {...p} />
