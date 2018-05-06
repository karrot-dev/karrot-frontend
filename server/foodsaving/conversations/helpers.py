from pymdownx import twemoji_db


def normalize_emoji_name(name: str) -> str:
    """Return a normalized name of emoji (important when the same emoji has multiple names)"""

    formatted_name = ':' + name + ':'

    if formatted_name in twemoji_db.emoji:
        return name

    if formatted_name in twemoji_db.aliases:
        return twemoji_db.aliases[formatted_name][1:-1]

    # when not found, raise error
    raise Exception('not found')
