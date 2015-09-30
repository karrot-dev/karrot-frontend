

def flatten(l):
    """
    Flatten a list of lists into a single list

    >>> ll = [[1, 2, 3], [4, 5, 6]]
    >>> flatten(ll)
    <generator object <genexpr> at 0x1111e89b0>
    >>> list(flatten(ll))
    [1, 2, 3, 4, 5, 6]

    :param l: the list of lists to flatten
    :return: list
    """
    return (a for b in l for a in b)


def get_keys(d, ks):
    """

    >>> get_keys({1:2, 3:4, 5:6}, [1, 3])
    {1: 2, 3: 4}

    :param d: dict
    :param ks: list of keys in the dict
    :return: filtered dict
    """
    return {
        k: d[k] for k in ks if k in d
    }