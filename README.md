<div align="justify"> 
  
<h1 align="center"> Voronoi Diagram </h1>

What happens when the meaning of distance changes?

The same set of points can divide space into smooth regions, sharp diamonds, or rigid squares depending on how “nearest” is calculated.
This project is an interactive React and TypeScript visualization of Voronoi diagrams under three distance metrics:

- Euclidean distance

- Manhattan distance

- Chebyshev distance

A Voronoi diagram divides a space into regions based on a collection of points called **seeds** or **sites**.

Every location in the visualization belongs to the seed that is closest to it. The meaning of “closest,” however, depends on the selected distance metric.

Given a collection of seeds

```math
P = \{p_1, p_2, \ldots, p_n\},
```

the Voronoi region belonging to seed $p_i$ is

```math
V_i =
\left\{
x \in \Omega
\;\middle|\;
d(x,p_i) \leq d(x,p_j)
\text{ for every } j
\right\}
```

Equivalently, the owner of a location \(x\) is:

$$ \mathrm{owner}(x) =
\arg\min_i d(x,p_i)
$$

The same seed positions can produce different regions when the distance function changes.

## Supported distance metrics

### Euclidean distance

Euclidean distance is the ordinary straight-line distance between two points.

For points

```math
A=(x_1,y_1)
\qquad\text{and}\qquad
B=(x_2,y_2)
```


the distance is

```math
d_E(A,B)
=
\sqrt{
(x_2-x_1)^2+
(y_2-y_1)^2
}
```
Under this metric, equal-distance growth around a seed forms a **circle**.

<img width="1451" height="823" alt="image" src="https://github.com/user-attachments/assets/b3ccbf20-8cd0-4a2f-9d81-212647cf39d7" />



### Manhattan distance

Manhattan distance measures distance when movement is restricted to horizontal and vertical directions.

```math
d_M(A,B)
=
|x_2-x_1|+
|y_2-y_1|
```
Under this metric, equal-distance growth around a seed forms a **diamond**.

<img width="1449" height="821" alt="image" src="https://github.com/user-attachments/assets/757a8f10-0167-4dfc-a59f-fe088e892814" />



### Chebyshev distance

Chebyshev distance uses the largest difference between the coordinates.

```math
d_C(A,B)
=
\max
\left(
|x_2-x_1|,
|y_2-y_1|
\right)
```

Under this metric, equal-distance growth around a seed forms a **square**.

<img width="1453" height="823" alt="image" src="https://github.com/user-attachments/assets/1b7b4636-fc42-4c19-9fe7-8970f4036873" />

## Minkowski connection

The three metrics are related through the Minkowski distance family:

```math
d_p(A,B)
=
\left(
|x_2-x_1|^p+
|y_2-y_1|^p
\right)^{\frac{1}{p}}
```

Different values of \(p\) produce different metrics:

- \(p=1\): Manhattan distance
- \(p=2\): Euclidean distance
- $p \to \infty$: Chebyshev distance

This relationship demonstrates how changing the definition of distance changes the geometry of space.


</div>
