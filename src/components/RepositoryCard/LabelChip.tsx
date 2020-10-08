import React from "react"
import { Theme, makeStyles } from "@material-ui/core/styles"
import { Chip } from "@material-ui/core"
import NotificationsIcon from "@material-ui/icons/Notifications"
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import CancelIcon from '@material-ui/icons/Cancel'
import { Label } from "../../utils/types"

export type LabelChipProps = Label & { 
	inSettingsPage?: boolean; 
	onDelete?: (data: Label) => void; 
}

const useLabelStyles = makeStyles((theme: Theme) => ({
	notificationsIcon: (props: any) => ({
		color: theme.palette.augmentColor({ main: props.color }).main,
		"&:hover": {
			color: theme.palette.augmentColor({ main: props.color }).dark
		}
	}),
	chip: ({ color, styleCondition }: { color: string, styleCondition: boolean }) => {
		const customChips = {
			backgroundColor: styleCondition
				? color
				: theme.palette.type === "dark"
					? theme.palette.grey[900]
					: "#fff",
			margin: theme.spacing(0.5),
			borderColor: theme.palette.augmentColor({ main: color }).main,
			color: !styleCondition
				? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
				: theme.palette.getContrastText(theme.palette.augmentColor({ main: color })[theme.palette.type]),
		}

		return {
			...customChips,
			"&:focus, &.MuiChip-outlined:focus": customChips,
		}
	},
}));

export type LabelChipStyle = {
	deleteIcon: React.ReactElement;
	variant: 'default' | 'outlined';
	size: 'small' | 'medium';
} 

const LabelChip: React.FC<LabelChipProps> = ({
	name,
	color,
    selected,
	subscribed,
	inSettingsPage,
	onDelete,
}) => {

	const styleCondition = inSettingsPage ? !selected : (selected || subscribed)
	const labelStyle = useLabelStyles({ color, styleCondition })

	const getChipStyle = (): LabelChipStyle => {
		let deleteIcon
		let variant: LabelChipStyle["variant"]
		let size: LabelChipStyle["size"]
		if (inSettingsPage) {
			if (!selected) {
				deleteIcon = <NotificationsOffIcon />
				variant = "default"
				size = "small"
			}
			else {
				deleteIcon = <CancelIcon />
				variant = "outlined"
				size = "medium"
			}
		} else {
			if (!selected) {
				deleteIcon = <NotificationsIcon className={labelStyle.notificationsIcon} />
				variant = "outlined"
				size = "medium"
			}
			else {
				deleteIcon = <CancelIcon />
				variant = "default"
				size = "small"
			}
		}

		return { deleteIcon, variant, size }
	}

	const { deleteIcon, variant, size } = getChipStyle()

	return (
		<li key={name}>
            {
                !inSettingsPage && subscribed ?
                <Chip
					label={name}
					className={labelStyle.chip}
					variant="default"
					size="small"
				/> :
				<Chip
					label={name}
					className={labelStyle.chip}
					variant={variant}
					onDelete={onDelete}
					size={size}
					deleteIcon={deleteIcon}
				/>
            }
		</li>
	);
}

export default LabelChip