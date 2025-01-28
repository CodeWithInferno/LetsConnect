'use client'

import * as React from 'react'
import { Command } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export function Combobox({
  children,
  open,
  onOpenChange,
  value,
  onChange,
  multiple,
  ...props
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command {...props}>
          {props.children}
        </Command>
      </PopoverContent>
    </Popover>
  )
}