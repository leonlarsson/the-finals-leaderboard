import {useCallback} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import Icons from "@/components/icons.tsx";

export enum Platform {
  CROSSPLAY = "crossplay",
  STEAM = "steam",
  PLAYSTATION = "psn",
  XBOX = "xbox"
}

enum FilterField {
  USER,
  PLATFORM
}

export interface Filter {
  user?: string,
  platform: Platform
}

export interface LeaderboardFiltersProps {
  filters: Filter
  onChange: (change: Filter) => void
}

export const DataTableFilters = ({ onChange, filters }: LeaderboardFiltersProps) => {
  const changeFilter = useCallback((e: string, field: FilterField) => {
    switch (field) {
      case FilterField.PLATFORM:
        onChange({...filters, platform: e as Platform || undefined})
        break
      case FilterField.USER:
        onChange({...filters, user: e})
        break
    }
  }, [filters])


  return (
    <div className="flex gap-2 flex-wrap">
      <Tabs
        value={filters.platform}
        onValueChange={e => changeFilter(e, FilterField.PLATFORM)}
      >
        <TabsList>
          <TabsTrigger value={Platform.CROSSPLAY}><Icons.crossplay className="h-5 w-5 inline" /></TabsTrigger>
          <TabsTrigger value={Platform.STEAM}><Icons.steam className="h-5 w-5 inline" /></TabsTrigger>
          <TabsTrigger value={Platform.XBOX}><Icons.xbox className="h-5 w-5 inline" /></TabsTrigger>
          <TabsTrigger value={Platform.PLAYSTATION}><Icons.playstation className="h-5 w-5 inline" /></TabsTrigger>
        </TabsList>
      </Tabs>
      <Input
        placeholder="Filter usernames..."
        value={filters.user}
        onChange={e => changeFilter(e.target.value, FilterField.USER)}
        className="max-w-sm"
      />
    </div>
  )
}