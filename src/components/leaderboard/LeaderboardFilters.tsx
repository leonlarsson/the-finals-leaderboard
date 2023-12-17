import CheckableTag from "antd/lib/tag/CheckableTag";
import {useCallback} from "react";
import Icons from "../icons.tsx";
import {Input, Space} from "antd";

export enum Platform {
  STEAM = "steam",
  PLAYSTATION = "ps",
  XBOX = "xbox"
}

export interface Filter {
  user: string | undefined,
  platforms: Platform[]
}

export interface LeaderboardFiltersProps {
  filters: Filter
  onChange: (change: Filter) => void
}

export const LeaderboardFilters = ({ onChange, filters }: LeaderboardFiltersProps) => {
  const togglePlatformFilter = useCallback((platform: Platform) => {
    const newFilters = { ...filters }

    if (filters.platforms.includes(platform)) newFilters.platforms = filters.platforms.filter(x => x !== platform)
    else newFilters.platforms = [...filters.platforms, platform]

    onChange(newFilters)
  }, [filters])

  return (
    <Space direction="vertical" className="w-full">
      <Input
        defaultValue={filters.user}
        size="large"
        placeholder="Search for a user"
        onChange={e => onChange({ ...filters, user: e.target.value })}
      />
      <Space>
        <CheckableTag
          key={Platform.STEAM}
          checked={filters.platforms.includes(Platform.STEAM)}
          onClick={() => togglePlatformFilter(Platform.STEAM)}>
          <Icons.steam className="h-5 w-5 inline" />{" "}
        </CheckableTag>
        <CheckableTag key={Platform.PLAYSTATION} checked={filters.platforms.includes(Platform.PLAYSTATION)} onClick={() => togglePlatformFilter(Platform.PLAYSTATION)}>
          <Icons.playstation className="h-5 w-5 inline" />{" "}
        </CheckableTag>
        <CheckableTag key={Platform.XBOX} checked={filters.platforms.includes(Platform.XBOX)} onClick={() => togglePlatformFilter(Platform.XBOX)}>
          <Icons.xbox className="h-5 w-5 inline" />{" "}
        </CheckableTag>
      </Space>
    </Space>
  )
}