interface Props {
    src: string;
    name: string;
}

export default function Avatar({ src, name }: Props) {
    return (
        <div className="flex items-center gap-2">
            <img
                src={src}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
            />

            <span className="font-medium">{name}</span>
        </div>
    );
}
